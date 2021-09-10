export default {
  string: {
    url: () => ({ key: 'statusMessages.invalidURL' }),
  },
  mixed: {
    required: () => ({ key: 'statusMessages.required' }),
    notOneOf: () => ({ key: 'statusMessages.RSSExists' }),
  },
};
