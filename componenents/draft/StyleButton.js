import PropTypes from "prop-types";

function StyleButton({ active, style, label, onToggle }) {
  return (
    <span
      onClick={() => onToggle(style)}
      className={`border rounded px-2 text-sm editor-style-button${
        active ? " editor-style-button-active" : ""
      }`}
    >
      {label}
    </span>
  );
}

StyleButton.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default StyleButton;
