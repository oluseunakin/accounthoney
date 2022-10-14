export function DailyAudit(prop: { audits: string[] }) {
  const { audits } = prop;
  return (
    <div className="space-y-2 lg:grid lg:justify-center">
      {audits.map((audit, i) => (
        <div key={i}>{audit}</div>
      ))}
    </div>
  );
}
