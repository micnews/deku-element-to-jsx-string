import test from 'tape';
import elementToString from './index';
import element from 'virtual-element';
import { connect, storePlugin } from 'deku-redux';
import { createStore } from 'redux';
import { renderString, tree } from 'deku';

function fixExpectedIndent (string) {
  return string.replace(/^ {4}/gm, '');
}

test('Simplest form of transform', (t) => {
  const actual = elementToString(<div></div>);
  const expected = '<div/>';

  t.equals(actual, expected);

  t.end();
});

test('Component', (t) => {
  const Component = {
    render: function () {
      return <div></div>;
    },
    name: 'Component'
  };

  const actual = elementToString(<Component />);
  const expected = '<Component/>';

  t.equals(actual, expected);

  t.end();
});

test('Component with attributes', (t) => {
  const Component = {
    render: function () {
      return <div></div>;
    },
    name: 'Component'
  };

  const props = {
    string: 'string',
    number: 1,
    callback: () => {},
    boolean: true,
    object: { foo: 'bar' },
    array: ['foo', 'bar']
  };

  const actual = elementToString(<Component {...props} />);
  const expected = fixExpectedIndent(`const object = {
      foo: 'bar'
    };
    const array = [
      'foo',
      'bar'
    ];
    <Component string='string'
      number={1}
      callback={function}
      boolean={true}
      object={object}
      array={array}/>`);

  t.equals(actual, expected);

  t.end();
});

test('Should remove redux attributes', (t) => {
  const Component = {
    render: function () {
      return <div></div>;
    },
    name: 'Component'
  };

  function render ({ props }) {
    return (elementToString(<Component {...props} />));
  }

  let ReduxComponent = connect(() => { return {}; })({ render });
  ReduxComponent.name = 'ReduxComponent';
  function callback () {}

  const app = tree(<ReduxComponent string='string' number={1} callback={callback} boolean={true} />);
  const store = createStore(() => {});
  app.use(storePlugin(store));
  const actual = renderString(app);
  const expected = fixExpectedIndent(`<Component string=\'string\'
      number={1}
      callback={function}
      boolean={true}/>`);

  t.equals(actual, expected);

  t.end();
});

test('Nested components', (t) => {
  const ParentComponent = {
    render: () => {
      return <div></div>;
    },
    name: 'ParentComponent'
  };

  const ChildComponent = {
    render: () => {
      return <div></div>;
    },
    name: 'ChildComponent'
  };

  const actual = elementToString(<ParentComponent><ChildComponent>child</ChildComponent></ParentComponent>);
  const expected = fixExpectedIndent(`<ParentComponent>
      <ChildComponent>child</ChildComponent>
    </ParentComponent>`);
  t.equals(actual, expected);

  t.end();
});

test('Should fail if name is not defined', (t) => {
  const Component = {
    render: function () {
      return <div></div>;
    }
  };

  t.throws(function () { elementToString(<Component />); });

  t.end();
});
