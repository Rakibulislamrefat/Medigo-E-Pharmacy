import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import type { Role } from "../../types/domain";
import { useAuthStore } from "./authStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");

  const canSubmit = useMemo(() => email.trim().includes("@") && password.trim().length >= 4, [email, password]);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  return (
    <div className="authWrap">
      <div className="authBrand">
        <div className="brandMarkLarge">M</div>
        <div>
          <div className="authTitle">Welcome back</div>
          <div className="muted">Sign in to order medicines online.</div>
        </div>
      </div>

      <Card title="Sign in" right={<ShieldCheck size={18} />}>
        <form
          className="grid"
          style={{ gridTemplateColumns: "1fr", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            login({ email: email.trim(), role });
            navigate(redirectTo, { replace: true });
          }}
        >
          <Field label="Email">
            <Input value={email} onChange={setEmail} type="email" autoComplete="email" placeholder="you@example.com" />
          </Field>
          <Field label="Password" hint="Demo only. Any 4+ chars.">
            <Input value={password} onChange={setPassword} type="password" autoComplete="current-password" />
          </Field>
          <Field label="Role">
            <Select
              value={role}
              onChange={setRole}
              options={[
                { value: "customer", label: "Customer" },
                { value: "admin", label: "Admin" },
                { value: "delivery", label: "Delivery" },
              ]}
            />
          </Field>
          <Button type="submit" disabled={!canSubmit}>
            Sign in
          </Button>
          <div className="muted" style={{ textAlign: "center" }}>
            New here? <Link to="/register">Create an account</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

