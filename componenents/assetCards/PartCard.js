import PropTypes from "prop-types";
import Link from "next/link";
import { deletePart } from "../../clientActions/part";
function PartCard({ projectPart, projectId, mutateProjectParts }) {
  return (
    <div key={projectPart._id} className="asset-card bg-white shadow mb-2">
      <Link href={`/projects/${projectId}/${projectPart._id}`}>
        <a className="mb-2">{projectPart.name}</a>
      </Link>
      <button
        className="block btn"
        onClick={async (e) => {
          e.preventDefault();
          if (
            window.confirm(
              `You are about to delete ${projectPart.name}. Are you sure you'd like to do that?`
            )
          ) {
            await deletePart(projectPart._id);
            await mutateProjectParts();
          }
        }}
      >
        Delete Part
      </button>
    </div>
  );
}

PartCard.propTypes = {
  projectPart: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  mutateProjectParts: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default PartCard;
