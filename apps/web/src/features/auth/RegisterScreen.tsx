import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "./authStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";

export function RegisterScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const canSubmit = useMemo(() => {
    if (!email.trim().includes("@")) return false;
    if (password.trim().length < 4) return false;
    if (password !== confirm) return false;
    return true;
  }, [email, password, confirm]);

  return (
    <div className="authWrap">
      <div className="authBrand">
        <div className="brandMarkLarge">M</div>
        <div>
          <div className="authTitle">Create your account</div>
          <div className="muted">Start ordering medicines in minutes.</div>
        </div>
      </div>

      <Card title="Create account">
        <form
          className="grid"
          style={{ gridTemplateColumns: "1fr", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            login({ email: email.trim(), role: "customer" });
            navigate("/", { replace: true });
          }}
        >
          <Field label="Email">
            <Input value={email} onChange={setEmail} type="email" autoComplete="email" placeholder="you@example.com" />
          </Field>
          <Field label="Password" hint="Demo only. Any 4+ chars.">
            <Input value={password} onChange={setPassword} type="password" autoComplete="new-password" />
          </Field>
          <Field label="Confirm password" error={confirm && confirm !== password ? "Passwords do not match" : undefined}>
            <Input value={confirm} onChange={setConfirm} type="password" autoComplete="new-password" />
          </Field>
          <Button type="submit" disabled={!canSubmit}>
            Create account
          </Button>
          <div className="muted" style={{ textAlign: "center" }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

