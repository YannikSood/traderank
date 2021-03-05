import { connectAutoComplete } from 'react-instantsearch-native';
import Mention from 'antd/lib/mention';
import '@ant-design/compatible/assets/index.css';
// import 'antd/lib/mention/style/index.css';

const Mentions = ({ hits, refine }) => (
  <Mention
    style={{ width: '100%', height: 100 }}
    suggestions={hits.map(hit => hit.username)}
    placeholder="Give someone an @-mention"
    notFoundContent="No suggestions"
    onSearchChange={username => refine(username)}
    multiLines
  />
);

export default connectAutoComplete(Mentions);
