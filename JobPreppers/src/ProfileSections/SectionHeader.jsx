import "./ProfileSections.css";

function SectionHeader({header}) {
  return (
    <>
      <div className="section-header">
        <h1>{header}</h1>
        <hr />
      </div>
    </>
  );
}

export default SectionHeader;
