import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/static/style.css" rel="stylesheet" />
			</head>
			<body>{children}</body>
		</html>
	);
});
