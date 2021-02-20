import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
function PartOverview() {
  const router = useRouter();
  const { partId, projectId } = router.query;
  // if (!partId) return null;

  // partId will be undefined on the first render.
  // Pass in the value
  const { data: partScenes, mutate } = useSWR(
    () =>
      partId
        ? `
    {
      partScenes(partId: "${partId}"){
        _id
        name
      }
    }
  `
        : null,
    fetcher
  );

  const { data: partData } = useSWR(
    () =>
      partId
        ? `
    { 
      part(partId: "${partId}"){
        _id
        name
      }
    }
  `
        : null,
    fetcher
  );

  if (!partData || !partScenes) {
    return (
      <div>
        <p>Loading Part Data and Scenes... Please be patient.</p>
      </div>
    );
  }
  const { part } = partData;
  return (
    <div className="w-full">
      <Link href={`/projects/${projectId}`}>
        <a>Back</a>
      </Link>
      <p>{part.name}</p>
      <Link href={`/projects/${projectId}/${part._id}/create-scene`}>
        <a>New Scene</a>
      </Link>
      <div className="grid grid-cols-1">
        {partScenes.partScenes.map((scene, index) => (
          <div key={scene._id} className="border p-2">
            <p>
              {`${index + 1}: ${scene.name.slice(0, 20)}${
                scene.name.length > 0 ? "..." : ""
              }`}
            </p>
            <Link href={`/projects/${projectId}/${partId}/${scene._id}`}>
              <a>Go to</a>
            </Link>
            <button
              className="block btn"
              onClick={async (e) => {
                e.preventDefault();
                if (
                  window.confirm(
                    `You are about to delete ${scene.name}. Are you sure you'd like to do that?`
                  )
                ) {
                  const result = await axios.post("/api/graphql", {
                    query: `
                      mutation($sceneId: String!){
                        deleteScene(sceneId:$sceneId){
                          scene{
                            _id
                            name
                          
                          }
                        }
                      }
                      
                      `,
                    variables: {
                      sceneId: scene._id,
                    },
                  });

                  const data = await mutate();
                  console.log(data);
                }
              }}
            >
              Delete Scene
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartOverview;
