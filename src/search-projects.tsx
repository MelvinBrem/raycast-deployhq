import { useEffect, useState } from "react";
import { getPreferenceValues, List } from "@raycast/api";

const { DeployHQAccountName, DeployHQUsername, DeployHQAPIKey } = getPreferenceValues<Preferences>();

interface Project {
  name: string;
  permalink: string;
}

interface State {
  items?: Project[];
}

export default function Command() {
  const [state, setState] = useState<State>({});
  const url = "https://" + DeployHQAccountName + ".deployhq.com/projects";

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: "Basic " + btoa(DeployHQUsername + ":" + DeployHQAPIKey),
          },
        });
        const projectData = (await response.json()) as any[];
        if (response.status > 200 || projectData.length === 0) {
          throw new Error("Error fetching projects");
        }

        let projects: Project[] = [];

        projectData.forEach((project: Project) => {
          projects.push({
            name: project.name,
            permalink: project.permalink,
          });
        });

        setState({
          items: projects,
        });
      } catch (error) {
        throw error;
      }
    }

    fetchProjects();
  }, []);

  return (
    <List isLoading={state.items?.length === 0}>
      {state.items?.map((item) => (
        <List.Item key={item.permalink} title={item.name} />
      ))}
    </List>
  );
}
