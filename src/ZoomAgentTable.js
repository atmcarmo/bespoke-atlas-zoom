import React from 'react';
import { Table } from '@cobalt/cobalt-react-components'
class ZoomAgentTable extends React.Component {
    constructor(props) {
        super(props);
        let agentList = fetchAgents();
        this.state = agentList;

    }
    render() {
        const agents = this.state.agents;
        return (
            <Table className='co-table co-table--scrollable co-table--scrollable--200 co-table--selectable'>
                <Table.Head>
                    <Table.Row>
                        <Table.Header> Agent </Table.Header>
                        <Table.Header> Phone </Table.Header>
                        <Table.Header> Status </Table.Header>
                    </Table.Row>
                </Table.Head>
                <AgentList agents={agents} />
            </Table>
        )
    }
    
}

function AgentList(props){
    const agents = props.agents;
    const agentList = agents.map((agent) => 
        <Table.Row key={agent.id}>
            <Table.Data> {agent.firstName} {agent.lastName} </Table.Data>
            <Table.Data> {agent.phone} </Table.Data>
            <Table.Data> {agent.presence_status} </Table.Data>
        </Table.Row>
    );
    return (
        <Table.Body>
            {agentList}
        </Table.Body>
    );
}

function fetchAgents(){
    return {
        agents: [
            {   
                "id": "hkzyghiqs1q757uqd2rcyq",
                "firstName" : "Frank",
                "lastName" : "Thomas",
                "email": "thebighurt@hotmail.com",
                "phone" : "+1-888-867-5309",
                "presence_status": "Available"
            },
            {   
                "id": "abcedfhiqs1q757uqd2rcyq",
                "firstName" : "David",
                "lastName" : "Ortiz",
                "email": "bigpapi@gmail.com",
                "phone" : "+1-877-555-1234",
                "presence_status": "Available"
            },
        ]
    }
}

export { ZoomAgentTable }