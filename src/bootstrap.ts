import { getPreferenceValues } from "@raycast/api";

type Preferences = {
  DeployHQAPIKey: string;
};

export default async function Command() {
  const { DeployHQAPIKey } = getPreferenceValues<Preferences>();
  if (!DeployHQAPIKey) {
    throw new Error("DeployHQ API Key is not set, ben je achterlijk?");
  }
}
