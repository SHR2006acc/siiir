import { getOperator } from "@/data/operators";

export function OperatorLogo({ operator, compact=false }: { operator: string; compact?: boolean }) {
  const primaryName = operator.split(" + ")[0];
  const data = getOperator(primaryName);
  return (
    <div className={`operator-logo ${compact ? "compact" : ""}`}>
      {data ? <img src={data.logo} alt={`Logo ${data.name}`} /> : <span>{primaryName.slice(0,2).toUpperCase()}</span>}
    </div>
  );
}

