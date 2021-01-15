import React, { useState } from 'react';

import { useTranslation } from "react-i18next";
import { Table, Checkbox } from '@cobalt/cobalt-react-components'

  
  const AgentRow = (props) => {
      const agent = props.agent
      const statusClass = agent.presence_status === 'Available' ? 'active' : 'inactive'
  
      return (
        <Table.Row key={agent.id}>
          <Table.Data> <span constName={statusClass}> {agent.firstName} {agent.lastName} </span></Table.Data>
          <Table.Data> {agent.phone} </Table.Data>
          <Table.Data> {agent.presence_status} </Table.Data>
        </Table.Row>
      )
  }
  
  const AgentTable = (props) => {
      const filterText = props.filterText
      const availableOnly = props.availableOnly
      const agents = props.agents
  
      const rows = []
  
      agents.forEach((agent) => {
        if (agent.firstName.indexOf(filterText) === -1
        && agent.lastName.indexOf(filterText) === -1) {
          return

        }
        if (availableOnly && agent.presence_status !== 'Available') {
          return

        }
        rows.push(
          <AgentRow key={agent.id}
            agent={agent}
          />
        );
      });

      return (
        <Table striped>
          <Table.Head>
              <Table.Row>
                  <Table.Header> Agent </Table.Header>
                  <Table.Header> Phone </Table.Header>
                  <Table.Header> Status </Table.Header>
              </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows} 
          </Table.Body>
        </Table>
      )
  }
  
 const SearchBar = (props) => {
  const [t] = useTranslation()

  const handleFilterTextChange = (e) => {
    props.onFilterTextChange(e.target.value)

  }
  
  const handleAvailableOnlyChange = (e) => {
    props.onInStockChange(e.target.checked)

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
  
  const FilterableZoomAgentTable = (props) => {
      /* convert to hooks 
      this.state = {
        filterText: '',
        availableOnly: false
      };*/
    let agents = props.agents

    const[filterText, setFilterText] = useState('')
    const[availableOnly, setAvailableOnly] = useState(false)
      
    const handleFilterTextChange = (filterText) => {
      setFilterText(filterText)

    }
    
    const handleAvailableOnlyChange = (availableOnly) => {
      setAvailableOnly(availableOnly)

    }
  
    return (
      <div>
        <SearchBar
          filterText={filterText}
          availableOnly={availableOnly}
          onFilterTextChange={handleFilterTextChange}
          onInStockChange={handleAvailableOnlyChange}
        />
        <AgentTable
          agents={agents}
          filterText={filterText}
          availableOnly={availableOnly}
        />
      </div>

    );
  }

  export { FilterableZoomAgentTable }