declare module "*.svg" {
	const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	export default content;
}

declare module "*.jpeg";
declare module "*.jpg";
declare module "*.png";
