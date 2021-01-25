# Atlas Zoom

## Local Development

### Atlas Development Environment
You can run this project locally, but you must first create an [Atlas Application Development Environment](https://talkdesk.atlassian.net/wiki/spaces/IE/pages/2241300548/Atlas+Application+Development+Environment) and a unique oauth client from the Developer Portal.


### json-server
json-server can be run locally and provide responses to mimic the bespoke-zoom API.  

```
# install json-server npm globally ( only the first time )
% npm install -g json-server
% json-server --watch --port 8000 json-server/agents.js

```
> From the browser, you can navigate to http://localhost:8000/agents