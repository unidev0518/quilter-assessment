import { IPin, IComponent, INet, IValidationResult } from '../models/Netlist';

interface INetlist {
  components: IComponent[];
  nets: INet[];
}


export const validateNetlist = (netlist: INetlist): IValidationResult[] => {
  const validationResults: IValidationResult[] = [];

  const componentsWithoutName = netlist.components.filter(component => !component.name || component.name.trim() === '');
  validationResults.push({
    rule: 'ComponentNameRequired',
    status: componentsWithoutName.length > 0 ? 'fail' : 'pass',
    message: componentsWithoutName.length > 0 
      ? `${componentsWithoutName.length} component(s) missing a name`
      : 'All components have names',
    componentIds: componentsWithoutName.map(component => component.id)
  });

  const netsWithoutName = netlist.nets.filter(net => !net.name || net.name.trim() === '');
  validationResults.push({
    rule: 'NetNameRequired',
    status: netsWithoutName.length > 0 ? 'fail' : 'pass',
    message: netsWithoutName.length > 0 
      ? `${netsWithoutName.length} net(s) missing a name`
      : 'All nets have names',
    netIds: netsWithoutName.map(net => net.id)
  });

  const componentsWithoutPins = netlist.components.filter(component => !component.pins || component.pins.length === 0);
  validationResults.push({
    rule: 'ComponentMustHavePins',
    status: componentsWithoutPins.length > 0 ? 'fail' : 'pass',
    message: componentsWithoutPins.length > 0 
      ? `${componentsWithoutPins.length} component(s) have no pins`
      : 'All components have at least one pin',
    componentIds: componentsWithoutPins.map(component => component.id)
  });

  const componentsWithUnnamedPins: string[] = [];
  netlist.components.forEach(component => {
    if (component.pins && component.pins.some(pin => !pin.name || pin.name.trim() === '')) {
      componentsWithUnnamedPins.push(component.id);
    }
  });
  validationResults.push({
    rule: 'PinNameRequired',
    status: componentsWithUnnamedPins.length > 0 ? 'fail' : 'pass',
    message: componentsWithUnnamedPins.length > 0 
      ? `${componentsWithUnnamedPins.length} component(s) have unnamed pins`
      : 'All pins have names',
    componentIds: componentsWithUnnamedPins
  });

  const netsWithoutConnections = netlist.nets.filter(net => !net.connections || net.connections.length === 0);
  validationResults.push({
    rule: 'NetMustHaveConnections',
    status: netsWithoutConnections.length > 0 ? 'fail' : 'pass',
    message: netsWithoutConnections.length > 0 
      ? `${netsWithoutConnections.length} net(s) have no connections`
      : 'All nets have at least one connection',
    netIds: netsWithoutConnections.map(net => net.id)
  });

  const invalidConnections: string[] = [];
  const componentMap = new Map<string, IComponent>();
  netlist.components.forEach(component => componentMap.set(component.id, component));

  netlist.nets.forEach(net => {
    if (net.connections) {
      net.connections.forEach(connection => {
        const component = componentMap.get(connection.componentId);
        if (!component) {
          invalidConnections.push(net.id);
          return;
        }

        const pin = component.pins.find(pin => pin.id === connection.pinId);
        if (!pin) {
          invalidConnections.push(net.id);
        }
      });
    }
  });

  validationResults.push({
    rule: 'ValidConnections',
    status: invalidConnections.length > 0 ? 'fail' : 'pass',
    message: invalidConnections.length > 0 
      ? `${invalidConnections.length} net(s) have invalid connections`
      : 'All connections are valid',
    netIds: [...new Set(invalidConnections)]
  });

  const gndNet = netlist.nets.find(net => 
    net.name.toLowerCase() === 'gnd' || 
    net.name.toLowerCase() === 'ground'
  );

  if (!gndNet) {
    validationResults.push({
      rule: 'GndNetRequired',
      status: 'fail',
      message: 'GND net is missing'
    });
  } else {

    const componentsRequiringGnd = netlist.components.filter(component => 
      component.type.toLowerCase().includes('ic') || 
      component.type.toLowerCase().includes('connector')
    );

    const componentsWithoutGnd: string[] = [];

    componentsRequiringGnd.forEach(component => {
      const isConnectedToGnd = gndNet.connections.some(connection => 
        connection.componentId === component.id
      );

      if (!isConnectedToGnd) {
        componentsWithoutGnd.push(component.id);
      }
    });

    validationResults.push({
      rule: 'GndConnections',
      status: componentsWithoutGnd.length > 0 ? 'fail' : 'pass',
      message: componentsWithoutGnd.length > 0 
        ? `${componentsWithoutGnd.length} component(s) that require GND are not connected to GND`
        : 'All components that require GND are connected',
      componentIds: componentsWithoutGnd
    });
  }

  return validationResults;
};
