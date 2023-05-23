import { ask, code, translate } from "./actions";
import ChatForm from "./form";

export default async function Page() {
  return <ChatForm action={ask} />;
}
