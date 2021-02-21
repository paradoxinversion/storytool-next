import PropTypes from "prop-types";
import Link from "next/link";
import { deleteScene } from "../../clientActions/scene";
function SceneCard({ scene, projectId, partId, mutateSceneData }) {
  return (
    <div key={scene._id} className="asset-card bg-white shadow mb-2 ">
      <Link href={`/projects/${projectId}/${partId}/${scene._id}`}>
        <a className="mb-2">
          {" "}
          {`${scene.name.slice(0, 20)}${scene.name.length > 20 ? "..." : ""}`}
        </a>
      </Link>
      {mutateSceneData && (
        <button
          className="block btn"
          onClick={async (e) => {
            e.preventDefault();
            if (
              window.confirm(
                `You are about to delete ${scene.name}. Are you sure you'd like to do that?`
              )
            ) {
              await deleteScene(scene._id);
              await mutateSceneData();
            }
          }}
        >
          Delete Scene
        </button>
      )}
    </div>
  );
}

SceneCard.propTypes = {
  scene: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  projectId: PropTypes.string.isRequired,
  partId: PropTypes.string.isRequired,
  mutateSceneData: PropTypes.func,
};

export default SceneCard;
