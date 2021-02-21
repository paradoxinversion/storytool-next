import PropTypes from "prop-types";
import Link from "next/link";
import { deleteProject } from "../../clientActions/project";
function ProjectCart({ project, mutateProjects, mutateScenes }) {
  <div key={project._id} className="asset-card shadow bg-white mb-2">
    <Link href={`/projects/${project._id}`}>
      <a className="underline mb-2">{project.name} </a>
    </Link>
    <button
      className="block btn"
      onClick={async (e) => {
        e.preventDefault();
        if (
          window.confirm(
            `You are about to delete ${project.name}. Are you sure you'd like to do that?`
          )
        ) {
          await deleteProject(project._id);
          await mutateProjects();
          await mutateScenes();
        }
      }}
    >
      Delete Project
    </button>
  </div>;
}

ProjectCart.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  mutateProjects: PropTypes.func.isRequired,
  mutateScenes: PropTypes.func.isRequired,
};

export default ProjectCart;
