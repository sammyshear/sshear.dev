import { MoonIcon, SunIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [theme, setTheme] = useState(
		localStorage.getItem("theme") ?? "light"
	);

	const handleClick = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<button
			className="hover:text-ctp-yellow inline-flex place-content-center"
			onClick={handleClick}
		>
			{theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
			<span className="w-0 h-0 overflow-hidden">Toggle Theme</span>
		</button>
	);
}
