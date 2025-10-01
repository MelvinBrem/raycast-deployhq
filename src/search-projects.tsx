import { useEffect, useState } from "react";
import { getPreferenceValues, List, Action, ActionPanel } from "@raycast/api";
import { Project } from "./lib/interfaces";
import { logger } from "./utils/logger";

const preferences: Preferences = getPreferenceValues<Preferences>();
interface State {
  items?: Project[];
}

export default function Command() {
  const [state, setState] = useState<State>({});
  const url = "https://" + preferences.DeployHQAccountName + ".deployhq.com/projects";

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: "Basic " + btoa(preferences.DeployHQUsername + ":" + preferences.DeployHQAPIKey),
          },
        });
        const projectData = (await response.json()) as any[];
        logger.debug(projectData);

        if (response.status > 200 || projectData.length === 0) {
          logger.error("Error fetching projects: " + JSON.stringify(response, null, 2));
          throw new Error("Error fetching projects");
        }

        setState({
          items: projectData,
        });
      } catch (error) {
        throw error;
      }
    }

    fetchProjects();
  }, []);

  return (
    <List throttle={true} isLoading={state.items === undefined}>
      {state.items?.map((item) => (
        <List.Item key={item.identifier} title={item.name} actions={projectActions(item)} />
      ))}
    </List>
  );
}

function projectActions(item: Project) {
  return (
    <ActionPanel>
      <Action.OpenInBrowser
        title="Open Project in browser"
        url={"https://" + preferences.DeployHQAccountName + ".deployhq.com/projects/" + item.permalink}
      />
      {item.repository?.hosting_service?.tree_url && (
        <Action.OpenInBrowser title="Open Repository in browser" url={item.repository.hosting_service.tree_url} />
      )}
    </ActionPanel>
  );
}
