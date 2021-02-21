import PropTypes from "prop-types";
import Link from "next/link";
function MiniSceneCard({ scene }) {
  return (
    <div key={scene._id} className="asset-card shadow bg-white">
      <Link
        href={`/projects/${scene.project._id}/${scene.part._id}/${scene._id}`}
      >
        <a className="underline">{`${scene.name.slice(0, 20)}...`} </a>
      </Link>
      <p className="text-sm text-left">
        {`Project: ${scene.project.name.slice(0, 20)}${
          scene.project.name.length > 20 ? "..." : ""
        }`}
      </p>
      <p className="text-sm text-left">
        {`Part: ${scene.part.name.slice(0, 20)}${
          scene.part.name.length > 20 ? "..." : ""
        }`}
      </p>
    </div>
  );
}

MiniSceneCard.propTypes = {
  scene: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    project: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    part: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
};

export default MiniSceneCard;
