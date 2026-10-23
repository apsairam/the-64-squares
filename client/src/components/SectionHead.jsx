export default function SectionHead({ kicker, title, body, titleId }) {
  return (
    <div className="section-head">
      <p className="kicker">{kicker}</p>
      <h2 className="display" id={titleId}>
        {title}
      </h2>
      {body && <p className="lede">{body}</p>}
    </div>
  );
}
