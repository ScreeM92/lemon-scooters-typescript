import { Client } from '@elastic/elasticsearch';


// Create Elasticsearch server
export default new Client({ node: 'http://localhost:9200' });