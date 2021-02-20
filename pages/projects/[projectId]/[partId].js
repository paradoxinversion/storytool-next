import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";

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
    <div>
      <Link href={`/projects/${projectId}`}>
        <a>Back</a>
      </Link>
      <p>{part.name}</p>
      <Link href={`/projects/${projectId}/${part._id}/create-scene`}>
        <a>New Scene</a>
      </Link>
      {partScenes.partScenes.map((partScene, index) => (
        <div key={partScene._id}>
          <p>
            {index + 1}: {partScene.name}
          </p>
          <Link href={`/projects/${projectId}/${partId}/${partScene._id}`}>
            <a>Go to</a>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PartOverview;
