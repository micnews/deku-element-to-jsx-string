import test from 'tape';
import elementToString from './index';
import element from 'virtual-element';

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

  function callback () {}

  const actual = elementToString(<Component string='string' number={1} callback={callback} boolean={true} />);
  const expected = '<Component string=\'string\' number={1} callback={function} boolean={true}/>';

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
  const expected = '<ParentComponent><ChildComponent>child</ChildComponent></ParentComponent>';
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
