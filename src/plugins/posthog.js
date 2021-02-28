import posthog from 'posthog-js';
posthog.init('NTUk31mG7Yjm_9LU-tOE3eG_2plHYC0XnmqZlnDd0L4', {
    api_host: 'https://blw-posthog-demo.herokuapp.com'
});
posthog.capture('my event', { property: 'value' });