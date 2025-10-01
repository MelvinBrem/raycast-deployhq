import { useEffect, useState } from "react";
import { getPreferenceValues, List, Action, ActionPanel } from "@raycast/api";
import Logger from "./classes/Logger";
import { Project, Repository } from "./lib/interfaces";

const preferences = getPreferenceValues<Preferences>();
const logger = new Logger("~/projects/raycast/deployhq/", "deployhq.log");

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

        if (response.status > 200 || projectData.length === 0) {
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
    <List isLoading={state.items?.length === 0}>
      {state.items?.map(
        (item) => (
          logger.log(item),
          (<List.Item key={item.identifier} title={item.name} actions={projectActions(item)} />)
        ),
      )}
    </List>
  );
}

function projectActions(item: Project) {
  return (
    <ActionPanel>
      <Action.OpenInBrowser
        title="Visit Project"
        url={"https://" + preferences.DeployHQAccountName + ".deployhq.com/projects/" + item.permalink}
      />
      {item.repository?.hosting_service?.tree_url && (
        <Action.OpenInBrowser title="Visit Repository" url={item.repository.hosting_service.tree_url} />
      )}
    </ActionPanel>
  );
}
