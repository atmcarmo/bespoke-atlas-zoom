import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import {
  Grid,
  Table,
  Checkbox,
  Pagination,
  Icon,
  TextInput,
  Form,
} from "@cobalt/cobalt-react-components";

import TokenGenerator from "./config/token.generator";

const AgentPhoneActive = (props) => {
  const agentPhone = props.agentPhone;
  const telUri = `td+tel://${agentPhone}`;
  return <a href={telUri}> {agentPhone} </a>;
};

const AgentPhone = (props) => {
  const agentPhone = props.agentPhone;
  return <div> {agentPhone} </div>;
};

const AgentRow = (props) => {
  const agent = props.agent;
  const statusColor =
    agent.presence === "Available" ? "co--green-600" : "co--secondary-200";
  const statusActive = agent.zoomId === props.selectedAgentId ? true : false;
  const onSelectedAgentChange = props.onSelectedAgentChange;
  return (
    <Table.Row
      key={agent.zoomId}
      active={statusActive}
      onClick={() => {
        onSelectedAgentChange(agent.zoomId);
      }}
    >
      <Table.Data>
        {" "}
        {agent.firstName} {agent.lastName}{" "}
      </Table.Data>
      <Table.Data>
        {statusActive ? (
          <AgentPhoneActive agentPhone={agent.phone} />
        ) : (
          <AgentPhone agentPhone={agent.phone} />
        )}
      </Table.Data>
      <Table.Data>
        {statusActive ? (
          <AgentPhoneActive agentPhone={agent.extension} />
        ) : (
          <AgentPhone agentPhone={agent.extension} />
        )}
      </Table.Data>
      <Table.Data> {agent.email} </Table.Data>
      <Table.Data alignment={Table.Data.ALIGNMENT.CENTER}>
        <Icon name="check_circle" color={statusColor} />{" "}
      </Table.Data>
    </Table.Row>
  );
};

const AgentTable = (props) => {
  const availableOnly = props.availableOnly;
  const agents = props.agents;

  const rows = [];

  agents.forEach((agent) => {
    if (availableOnly && agent.presence !== "Available") {
      return;
    }
    rows.push(
      <AgentRow
        key={agent.zoomId}
        agent={agent}
        onSelectedAgentChange={props.handleSelectedAgentChange}
        selectedAgentId={props.selectedAgentId}
      />
    );
  });

  return (
    <Table selectable>
      <Table.Head>
        <Table.Row>
          <Table.Header> Agent </Table.Header>
          <Table.Header> Phone </Table.Header>
          <Table.Header> Extension </Table.Header>
          <Table.Header> Email </Table.Header>
          <Table.Header alignment={Table.Header.ALIGNMENT.CENTER}>
            {" "}
            Status{" "}
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>{rows}</Table.Body>
    </Table>
  );
};

const SearchBar = (props) => {
  const [t] = useTranslation();

  const handleFilterTextChange = (e) => {
    props.onFilterTextChange(e.target.value);
  };

  const handleAvailableOnlyChange = (e) => {
    props.onAvailablityChange(e.target.checked);
  };

  return (
    <Form>
      <TextInput value={props.filterText} onChange={handleFilterTextChange} />
      <Checkbox
        value="availableOnly"
        checked={props.availableOnly}
        onChange={handleAvailableOnlyChange}
      >
        {t("Only show available agents")}
      </Checkbox>
    </Form>
  );
};

const PageNavigation = (props) => {
  let currentPage = props.currentPage;
  let totalPages = props.totalPages;
  const handlePageChange = (nextPage) => {
    props.onPageChange(nextPage);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageClick={handlePageChange}
      fluid
    />
  );
};

const FilterableZoomAgentTable = (props) => {
  const [filterText, setFilterText] = useState();
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [agents, setAgents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState();

  const PAGE_QUERY_PARAM = process.env.REACT_APP_PAGE_QUERY_PARAM;
  const LIMIT_QUERY_PARAM = process.env.REACT_APP_LIMIT_QUERY_PARAM;
  const ENDPOINT_BASE_URL = process.env.REACT_APP_ENDPOINT_BASE;

  const pageLength = 10;

  useEffect(() => {
    if (typeof selectedAgentId !== "undefined") {
      let ENDPOINT_URL = `${ENDPOINT_BASE_URL}/agents/${selectedAgentId}`;
      TokenGenerator.get().then((accessToken) => {
        fetch(ENDPOINT_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            let totalCount = response.headers.get("X-Total-Count");
            setTotalPages(Math.ceil(totalCount / pageLength));
            return response.json();
          })
          .then((data) => {
            const index = agents.findIndex(
              (agent) => agent.id === selectedAgentId
            );
            agents[index] = data;
          })
          .catch((error) => console.log(error));
      });
    }
  }, [selectedAgentId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let ENDPOINT_URL = `${ENDPOINT_BASE_URL}/agents?${PAGE_QUERY_PARAM}=${page}&${LIMIT_QUERY_PARAM}=${pageLength}`;
      if (filterText !== "" && typeof filterText !== "undefined")
        ENDPOINT_URL += `&agentName=${filterText}`;
      TokenGenerator.get().then((accessToken) => {
        fetch(ENDPOINT_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            let totalCount = response.headers.get("X-Total-Count");
            setTotalPages(Math.ceil(totalCount / pageLength));
            return response.json();
          })
          .then((data) => {
            setAgents(data);
          })
          .catch((error) => console.log(error));
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filterText, page]);

  const handleFilterTextChange = (filterText) => {
    setFilterText(filterText);
  };

  const handleAvailableOnlyChange = (availableOnly) => {
    setAvailableOnly(availableOnly);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    setSelectedAgentId();
  };

  const handleSelectedAgentChange = (agentId) => {
    setSelectedAgentId(agentId);
  };

  return (
    <Grid>
      <Grid.Group>
        <Grid.Column all="100">
          <SearchBar
            filterText={filterText}
            availableOnly={availableOnly}
            onFilterTextChange={handleFilterTextChange}
            onAvailablityChange={handleAvailableOnlyChange}
          />
        </Grid.Column>
        <Grid.Column>
          <AgentTable
            agents={agents}
            filterText={filterText}
            availableOnly={availableOnly}
            handleSelectedAgentChange={handleSelectedAgentChange}
            selectedAgentId={selectedAgentId}
          />
        </Grid.Column>
        <Grid.Column pushCenter all="100">
          <PageNavigation
            onPageChange={handlePageChange}
            currentPage={page}
            totalPages={totalPages}
          />
        </Grid.Column>
      </Grid.Group>
    </Grid>
  );
};

export { FilterableZoomAgentTable };
