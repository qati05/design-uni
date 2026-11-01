import { BODY3D } from "../../components/body.js";
import HeroSzene from "../../components/HeroSzene.js";
export default function Page() {
  return (<><div dangerouslySetInnerHTML={{ __html: BODY3D }} /><HeroSzene /></>);
}
