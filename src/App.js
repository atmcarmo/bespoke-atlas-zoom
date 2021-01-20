import React from 'react';
import CobaltRoot, { Loader, Page, Header, H1, H2, Grid, Card, Avatar, Paragraph } from '@cobalt/cobalt-react-components';
import { useTranslation } from "react-i18next";
import { useCurrentUser } from './hooks'
import { FilterableZoomAgentTable } from './FilterableZoomAgentTable'

export default function App() {
  const user = useCurrentUser();
  return (
    <CobaltRoot>
      <AppContent user={user} />
    </CobaltRoot>
  )
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
  )
}

function AppHeader() {
  const [t] = useTranslation();

  return (
    <Header contained borderless>
      <Header.Heading>
        <Header.Title>
          <H1>
            {t('Zoom-Talkdesk Integration')}
          </H1>
        </Header.Title>
      </Header.Heading>
    </Header>
  )
}

function Content({ user }) {
  return (
    <Card>
      <Header borderless>
        <Avatar primary>{getInitials(user.name)}</Avatar>
        <Header.Heading>
          <Header.Title>
            <H2>{user.name}</H2>
          </Header.Title>
        </Header.Heading>
      </Header>
      <Card.Content pushContent>
        <Paragraph>{user.email}</Paragraph>
      </Card.Content>
    </Card>
  )
}

function getInitials(fullname) {
  return fullname.split(' ').map((n) => n[0]).join('');
}
