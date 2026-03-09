import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiKey, FiShield, FiUser } from "react-icons/fi";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
import { getAuth, setAuth } from "../api.js";

export default function LoginPage() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const { sessionId, role } = getAuth();
		if (sessionId && role === "admin")
			navigate("/leaderboard", { replace: true });
		if (sessionId && role === "user") navigate("/game", { replace: true });
	}, [navigate]);

	async function onLogin(e) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const resp = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			const data = await resp.json().catch(() => ({}));
			if (!resp.ok) {
				setError(data.error || "Login failed.");
				return;
			}

			setAuth({ sessionId: data.sessionId, role: data.role });
			if (data.role === "admin") navigate("/leaderboard", { replace: true });
			else navigate("/game", { replace: true });
		} catch {
			setError("Network error.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="appShell authShell">
			<div className="bgFX" />
			<div className="ambientOrb orbOne" />
			<div className="container authLayout">
				<motion.section
					className="authHero"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45 }}>
					<div className="eyebrow">Security Simulation</div>
					<h1 className="heroTitle">Prompt Breaker Arena</h1>
					<p className="heroSubtitle">
						Breach eight adaptive defense layers, recover hidden passwords, and
						push your name to the top of the leaderboard.
					</p>
					<div className="badgeRow">
						<motion.span
							whileHover={{ y: -2 }}
							className="pill iconPill pulsePill">
							<FiShield /> Encrypted session
						</motion.span>
						<motion.span
							whileHover={{ y: -2 }}
							className="pill iconPill pulsePill">
							<FiKey /> Admin demo: admin / admin123
						</motion.span>
					</div>
				</motion.section>

				<Tilt
					className="tiltWrap"
					tiltMaxAngleX={5}
					tiltMaxAngleY={5}
					perspective={900}
					scale={1.015}
					gyroscope={false}>
					<motion.section
						className="authCard"
						initial={{ opacity: 0, y: 24, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 0.1, duration: 0.4 }}>
						<div className="panelTitle">Enter the Arena</div>
						<div className="small">Use player credentials or admin access.</div>

						<form className="stackForm" onSubmit={onLogin}>
							<label className="fieldWrap">
								<span className="fieldLabel">Username</span>
								<div className="inputWrap">
									<FiUser className="inputIcon" />
									<input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Username"
										autoComplete="username"
									/>
								</div>
							</label>

							<label className="fieldWrap">
								<span className="fieldLabel">Password</span>
								<div className="inputWrap">
									<FiKey className="inputIcon" />
									<input
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Password"
										type="password"
										autoComplete="current-password"
									/>
								</div>
							</label>

							<motion.button
								whileHover={{ scale: 1.015 }}
								whileTap={{ scale: 0.985 }}
								disabled={loading}
								type="submit">
								{loading ? "Initializing session..." : "Enter Arena"}
							</motion.button>
							<div className="small errorText">{error}</div>
						</form>
					</motion.section>
				</Tilt>
			</div>
		</div>
	);
}
