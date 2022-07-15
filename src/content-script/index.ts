import { Message } from 'utils';
import { nanoid } from 'nanoid';
import { browser } from 'webextension-polyfill-ts';
import { EVENTS } from '@/constant';
import { isManifestV3 } from '@/utils/mv3';

// XXX: This is a temporary solution to shim the legacy API.
const channelName = '1';

// the script element with src won't execute immediately
// use inline script element instead!
const container = document.head || document.documentElement;
const ele = document.createElement('script');

if (isManifestV3()) {
  ele.setAttribute('src', browser.runtime.getURL('pageProvider.js'));
} else {
  // in prevent of webpack optimized code do some magic(e.g. double/sigle quote wrap),
  // seperate content assignment to two line
  // use AssetReplacePlugin to replace pageprovider content
  let content = `var channelName = '${channelName}';`;
  content += '#PAGEPROVIDER#';
  ele.textContent = content;
}
container.insertBefore(ele, container.children[0]);
container.removeChild(ele);

const { BroadcastChannelMessage, PortMessage } = Message;

const pm = new PortMessage().connect();

const bcm = new BroadcastChannelMessage(channelName).listen((data) =>
  pm.request(data)
);

// background notification
pm.on('message', (data) => bcm.send('message', data));

pm.request({
  type: EVENTS.UIToBackground,
  method: 'getScreen',
  params: { availHeight: screen.availHeight },
});

document.addEventListener('beforeunload', () => {
  bcm.dispose();
  pm.dispose();
});
