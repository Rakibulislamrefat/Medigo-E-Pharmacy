import { Link } from "react-router-dom";

import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <Card title="Not found">
      <div className="emptyState">
        This page does not exist. <Link to="/medicines">Go to medicines</Link>
      </div>
    </Card>
  );
}
