import React from "react";
import CobaltRoot, {
  Page,
  Header,
  H1,
  Grid,
} from "@cobalt/cobalt-react-components";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "./hooks";
import { FilterableZoomAgentTable } from "./FilterableZoomAgentTable";

export default function App() {
  const user = useCurrentUser();
  return (
    <CobaltRoot>
      <AppContent user={user} />
    </CobaltRoot>
  );
}

function AppContent({ user }) {
  return (
    <Page>
      <AppHeader />
      <Page.Content>
        <Grid pushCenter fullHeight>
          <Grid.Group>
            <FilterableZoomAgentTable />
          </Grid.Group>
        </Grid>
      </Page.Content>
    </Page>
  );
}

function AppHeader() {
  const [t] = useTranslation();

  return (
    <Header contained borderless>
      <Header.Heading>
        <Header.Title>
          <H1>{t("Zoom-Talkdesk")}</H1>
        </Header.Title>
      </Header.Heading>
    </Header>
  );
}
