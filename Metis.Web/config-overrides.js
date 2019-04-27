const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#2abdbd',                   // primary color for all components
      '@link-color': '#1890ff',                            // link color
      '@success-color': '#52c41a',                         // success state color
      '@warning-color': '#faad14',                         // warning state color
      '@error-color': '#f5222d',                           // error state color
      '@font-size-base': '14px',                           // major text font size
      '@heading-color': '#ffffffe6',              // heading text color
      '@text-color': '#d0d0d0',                 // major text color
      '@text-color-secondary': '#a1a1a1',      // secondary text color
      '@disabled-color': ' rgba(0, 0, 0, .25)',            // disable state color
      '@border-radius-base': '4px',                        // major border radius
      '@border-color-base': '#a1a1a1',                     // major border color
      '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)'  // major shadow for layers
    },
  }),
);
