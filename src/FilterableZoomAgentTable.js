import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import { Grid, Table, Checkbox, Radio, Pagination, Icon } from '@cobalt/cobalt-react-components'


const AgentRow = (props) => {
  const agent = props.agent
  const statusColor = agent.presence_status ? 'co--primary-600' : 'co--secondary-200'
  const onSelectedAgentChange = props.onSelectedAgentChange
  const selected = agent.id === props.selectedAgentId

  return (
    <Table.Row selected={selected} key={agent.id}>
      <Table.Data>
        <Radio checked={selected} value={agent.id} onChange={onSelectedAgentChange} />
      </Table.Data>
      <Table.Data> {agent.firstName} {agent.lastName} </Table.Data>
      <Table.Data> {agent.phone} </Table.Data>
      <Table.Data> {agent.email} </Table.Data>
      <Table.Data alignment={Table.Data.ALIGNMENT.CENTER}>
        <Icon name="check_circle" color={statusColor} /> </Table.Data>
    </Table.Row>
  )
}

const AgentTable = (props) => {
  const availableOnly = props.availableOnly
  const agents = props.agents

  const rows = []

  agents.forEach((agent) => {
    if (availableOnly && agent.presence_status !== true) {
      return

    }
    rows.push(
      <AgentRow key={agent.id}
        agent={agent}
        onSelectedAgentChange={props.handleSelectedAgentChange}
        selectedAgentId={props.selectedAgentId}
      />
    );
  });

  return (
    <Grid fullWidth>
      <Table selectable>
        <Table.Head>
          <Table.Row>
            <Table.Header> </Table.Header>
            <Table.Header> Agent </Table.Header>
            <Table.Header> Phone </Table.Header>
            <Table.Header> Email </Table.Header>
            <Table.Header> Status </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    </Grid>
  )
}

const SearchBar = (props) => {
  const [t] = useTranslation()
  
  const handleFilterTextChange = (e) => {
     props.onFilterTextChange(e.target.value)

  }

  const handleAvailableOnlyChange = (e) => {
    props.onAvailablityChange(e.target.checked)

  }

  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={props.filterText}
        onChange={handleFilterTextChange}
      />
      <Checkbox
        value='availableOnly'
        checked={props.availableOnly}
        onChange={handleAvailableOnlyChange} >
        {t('Only show available agents')}
      </Checkbox>
    </form>
  )

}

const PageNavigation = (props) => {
  let currentPage = props.currentPage
  let totalPages = props.totalPages
  const handlePageChange = (nextPage) => {
    props.onPageChange(nextPage)

  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageClick={handlePageChange}
      showNavLabels={false}
      collapsed

    />

  )

}

const FilterableZoomAgentTable = (props) => {
  const [filterText, setFilterText] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [agents, setAgents] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [selectedAgentId, setSelectedAgentId] = useState()

  const pageLength = 10

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let endpointUrl = `http://localhost:8000/agents?_page=${page}&_limit=${pageLength}`
      if(filterText !== '' && filterText !== null)
        endpointUrl += `&agent_name=${filterText}`
      fetch(
        endpointUrl,
        {
          method: "GET"
  
        }
      ).then(response => {
        let totalCount = response.headers.get('X-Total-Count')
        setTotalPages(Math.ceil(totalCount / pageLength))
        return response.json()
      }).then(response => {
        setAgents(response)
      }).catch(error => console.log(error))
    }, 500)

    return () => clearTimeout(delayDebounceFn)

  }, [page, filterText])

  const handleFilterTextChange = (filterText) => {
    setFilterText(filterText)

  }

  const handleAvailableOnlyChange = (availableOnly) => {
    setAvailableOnly(availableOnly)

  }

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber)
    setSelectedAgentId()

  }

  const handleSelectedAgentChange = (e) => {
    setSelectedAgentId(e.target.value)

  }

  return (
    <div>
      <SearchBar
        filterText={filterText}
        availableOnly={availableOnly}
        onFilterTextChange={handleFilterTextChange}
        onAvailablityChange={handleAvailableOnlyChange}
      />
      <AgentTable
        agents={agents}
        filterText={filterText}
        availableOnly={availableOnly}
        handleSelectedAgentChange={handleSelectedAgentChange}
        selectedAgentId={selectedAgentId}
      />
      <PageNavigation
        onPageChange={handlePageChange}
        currentPage={page}
        totalPages={totalPages}

      />
    </div>

  );
}

export { FilterableZoomAgentTable }