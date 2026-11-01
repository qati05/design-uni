import { BODY } from "../components/body.js";
export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: BODY }} />;
}
