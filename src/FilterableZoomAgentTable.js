import React from 'react';
import { useTranslation } from "react-i18next";
import { Table, Checkbox } from '@cobalt/cobalt-react-components'

  
  class AgentRow extends React.Component {
    render() {
      const agent = this.props.agent;
      const statusClass = agent.presence_status === 'Available' ? 'active' : 'inactive';
  
      return (
        <Table.Row key={agent.id}>
          <Table.Data> <span className={statusClass}> {agent.firstName} {agent.lastName} </span></Table.Data>
          <Table.Data> {agent.phone} </Table.Data>
          <Table.Data> {agent.presence_status} </Table.Data>
        </Table.Row>
      );
    }
  }
  
  class AgentTable extends React.Component {
    render() {
      const filterText = this.props.filterText;
      const availableOnly = this.props.availableOnly;
  
      const rows = [];
  
      this.props.agents.forEach((agent) => {
        if (agent.firstName.indexOf(filterText) === -1
        && agent.lastName.indexOf(filterText) === -1) {
          return;
        }
        if (availableOnly && agent.presence_status !== 'Available') {
          return;
        }
        rows.push(
          <AgentRow key={agent.id}
            agent={agent}
          />
        );
      });

      return (
        <Table>
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
      );
    }
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
  
  class FilterableZoomAgentTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterText: '',
        availableOnly: false
      };
      
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleAvailableOnlyChange = this.handleAvailableOnlyChange.bind(this);
    }
  
    handleFilterTextChange(filterText) {
      this.setState({
        filterText: filterText
      });
    }
    
    handleAvailableOnlyChange(availableOnly) {
      this.setState({
        availableOnly: availableOnly
      })
    }
  
    render() {
      return (
        <div>
          <SearchBar
            filterText={this.state.filterText}
            availableOnly={this.state.availableOnly}
            onFilterTextChange={this.handleFilterTextChange}
            onInStockChange={this.handleAvailableOnlyChange}
          />
          <AgentTable
            agents={this.props.agents}
            filterText={this.state.filterText}
            availableOnly={this.state.availableOnly}
          />
        </div>
      );
    }
  }

  export { FilterableZoomAgentTable }