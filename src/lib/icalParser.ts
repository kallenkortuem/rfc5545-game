// RFC 5545 iCalendar Parser and Validator

export interface ParseResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  components: CalendarComponent[];
  properties: Property[];
}

export interface ValidationError {
  line: number;
  message: string;
  code: string;
  severity: 'error';
}

export interface ValidationWarning {
  line: number;
  message: string;
  code: string;
  severity: 'warning';
}

export interface CalendarComponent {
  type: string;
  properties: Property[];
  subComponents: CalendarComponent[];
  startLine: number;
  endLine: number;
}

export interface Property {
  name: string;
  value: string;
  parameters: Parameter[];
  line: number;
}

export interface Parameter {
  name: string;
  value: string;
}

// RFC 5545 Constants
const REQUIRED_CALENDAR_PROPERTIES = ['VERSION', 'PRODID'];
const VALID_COMPONENTS = ['VCALENDAR', 'VEVENT', 'VTODO', 'VJOURNAL', 'VFREEBUSY', 'VTIMEZONE', 'VALARM'];
const REQUIRED_EVENT_PROPERTIES = ['UID', 'DTSTAMP'];

// Line folding regex (RFC 5545 Section 3.1)
const FOLDED_LINE_REGEX = /\r?\n[ \t]/g;

export function parseICalendar(input: string): ParseResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const components: CalendarComponent[] = [];
  const properties: Property[] = [];

  // Normalize line endings and unfold lines
  const normalizedInput = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const unfoldedInput = normalizedInput.replace(FOLDED_LINE_REGEX, '');
  const lines = unfoldedInput.split('\n').filter(line => line.trim() !== '');

  // Parse the content
  const parseContext = {
    currentComponent: null as CalendarComponent | null,
    componentStack: [] as CalendarComponent[],
    lineNumber: 0
  };

  for (let i = 0; i < lines.length; i++) {
    parseContext.lineNumber = i + 1;
    const line = lines[i].trim();

    if (line.startsWith('BEGIN:')) {
      handleBegin(line, parseContext, components, errors);
    } else if (line.startsWith('END:')) {
      handleEnd(line, parseContext, errors);
    } else if (line.includes(':')) {
      handleProperty(line, parseContext, properties, errors);
    } else if (line !== '') {
      errors.push({
        line: parseContext.lineNumber,
        message: `Invalid line format: "${line}"`,
        code: 'INVALID_LINE',
        severity: 'error'
      });
    }
  }

  // Validate component stack is empty
  if (parseContext.componentStack.length > 0) {
    errors.push({
      line: lines.length,
      message: `Unclosed component: ${parseContext.componentStack[parseContext.componentStack.length - 1].type}`,
      code: 'UNCLOSED_COMPONENT',
      severity: 'error'
    });
  }

  // Perform semantic validation
  validateSemantics(components, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    components,
    properties
  };
}

function handleBegin(line: string, context: any, components: CalendarComponent[], errors: ValidationError[]) {
  const componentType = line.substring(6).trim();

  if (!VALID_COMPONENTS.includes(componentType)) {
    errors.push({
      line: context.lineNumber,
      message: `Unknown component type: ${componentType}`,
      code: 'UNKNOWN_COMPONENT',
      severity: 'error'
    });
    return;
  }

  const newComponent: CalendarComponent = {
    type: componentType,
    properties: [],
    subComponents: [],
    startLine: context.lineNumber,
    endLine: -1
  };

  if (context.currentComponent) {
    context.currentComponent.subComponents.push(newComponent);
    context.componentStack.push(context.currentComponent);
  } else {
    components.push(newComponent);
  }

  context.currentComponent = newComponent;
}

function handleEnd(line: string, context: any, errors: ValidationError[]) {
  const componentType = line.substring(4).trim();

  if (!context.currentComponent) {
    errors.push({
      line: context.lineNumber,
      message: `END without matching BEGIN: ${componentType}`,
      code: 'UNMATCHED_END',
      severity: 'error'
    });
    return;
  }

  if (context.currentComponent.type !== componentType) {
    errors.push({
      line: context.lineNumber,
      message: `Mismatched END:${componentType} for BEGIN:${context.currentComponent.type}`,
      code: 'MISMATCHED_END',
      severity: 'error'
    });
    return;
  }

  context.currentComponent.endLine = context.lineNumber;

  if (context.componentStack.length > 0) {
    context.currentComponent = context.componentStack.pop();
  } else {
    context.currentComponent = null;
  }
}

function handleProperty(line: string, context: any, globalProperties: Property[], errors: ValidationError[]) {
  const colonIndex = line.indexOf(':');
  const nameAndParams = line.substring(0, colonIndex);
  const value = line.substring(colonIndex + 1);

  // Parse property name and parameters
  const semicolonIndex = nameAndParams.indexOf(';');
  const propertyName = semicolonIndex === -1 ? nameAndParams : nameAndParams.substring(0, semicolonIndex);
  const parameters = semicolonIndex === -1 ? [] : parseParameters(nameAndParams.substring(semicolonIndex + 1));

  const property: Property = {
    name: propertyName.toUpperCase(),
    value,
    parameters,
    line: context.lineNumber
  };

  if (context.currentComponent) {
    context.currentComponent.properties.push(property);
  } else {
    globalProperties.push(property);
  }
}

function parseParameters(paramString: string): Parameter[] {
  const parameters: Parameter[] = [];
  const params = paramString.split(';');

  for (const param of params) {
    const equalIndex = param.indexOf('=');
    if (equalIndex !== -1) {
      parameters.push({
        name: param.substring(0, equalIndex).toUpperCase(),
        value: param.substring(equalIndex + 1)
      });
    }
  }

  return parameters;
}

function validateSemantics(components: CalendarComponent[], errors: ValidationError[], warnings: ValidationWarning[]) {
  // Check for VCALENDAR
  const vcalendars = components.filter(c => c.type === 'VCALENDAR');
  if (vcalendars.length === 0) {
    errors.push({
      line: 1,
      message: 'Missing VCALENDAR component',
      code: 'MISSING_VCALENDAR',
      severity: 'error'
    });
    return;
  }

  if (vcalendars.length > 1) {
    errors.push({
      line: vcalendars[1].startLine,
      message: 'Multiple VCALENDAR components found',
      code: 'MULTIPLE_VCALENDAR',
      severity: 'error'
    });
  }

  // Validate VCALENDAR
  const vcalendar = vcalendars[0];
  validateVCalendar(vcalendar, errors, warnings);

  // Validate sub-components
  for (const subComponent of vcalendar.subComponents) {
    validateComponent(subComponent, errors, warnings);
  }
}

function validateVCalendar(vcalendar: CalendarComponent, errors: ValidationError[], warnings: ValidationWarning[]) {
  // Check required properties
  for (const required of REQUIRED_CALENDAR_PROPERTIES) {
    const found = vcalendar.properties.find(p => p.name === required);
    if (!found) {
      errors.push({
        line: vcalendar.startLine,
        message: `Missing required property: ${required}`,
        code: 'MISSING_REQUIRED_PROPERTY',
        severity: 'error'
      });
    }
  }

  // Validate VERSION
  const version = vcalendar.properties.find(p => p.name === 'VERSION');
  if (version && version.value !== '2.0') {
    warnings.push({
      line: version.line,
      message: `VERSION should be "2.0" (found: "${version.value}")`,
      code: 'INVALID_VERSION',
      severity: 'warning'
    });
  }
}

function validateComponent(component: CalendarComponent, errors: ValidationError[], warnings: ValidationWarning[]) {
  switch (component.type) {
    case 'VEVENT':
      validateEvent(component, errors, warnings);
      break;
    case 'VTODO':
      validateTodo(component, errors, warnings);
      break;
    case 'VTIMEZONE':
      validateTimezone(component, errors, warnings);
      break;
    // Add more component validations as needed
  }
}

function validateEvent(event: CalendarComponent, errors: ValidationError[], warnings: ValidationWarning[]) {
  // Check required properties
  for (const required of REQUIRED_EVENT_PROPERTIES) {
    const found = event.properties.find(p => p.name === required);
    if (!found) {
      errors.push({
        line: event.startLine,
        message: `VEVENT missing required property: ${required}`,
        code: 'MISSING_REQUIRED_PROPERTY',
        severity: 'error'
      });
    }
  }

  // Must have either DTSTART or METHOD
  const dtstart = event.properties.find(p => p.name === 'DTSTART');
  const method = event.properties.find(p => p.name === 'METHOD');
  if (!dtstart && !method) {
    errors.push({
      line: event.startLine,
      message: 'VEVENT must have either DTSTART or METHOD property',
      code: 'MISSING_DTSTART_OR_METHOD',
      severity: 'error'
    });
  }
}

function validateTodo(todo: CalendarComponent, errors: ValidationError[], warnings: ValidationWarning[]) {
  // Similar validation for VTODO
  const requiredProps = ['UID', 'DTSTAMP'];
  for (const required of requiredProps) {
    const found = todo.properties.find(p => p.name === required);
    if (!found) {
      errors.push({
        line: todo.startLine,
        message: `VTODO missing required property: ${required}`,
        code: 'MISSING_REQUIRED_PROPERTY',
        severity: 'error'
      });
    }
  }
}

function validateTimezone(timezone: CalendarComponent, errors: ValidationError[], warnings: ValidationWarning[]) {
  // Check for TZID
  const tzid = timezone.properties.find(p => p.name === 'TZID');
  if (!tzid) {
    errors.push({
      line: timezone.startLine,
      message: 'VTIMEZONE missing required property: TZID',
      code: 'MISSING_REQUIRED_PROPERTY',
      severity: 'error'
    });
  }

  // Must have at least one STANDARD or DAYLIGHT component
  const hasStandard = timezone.subComponents.some(c => c.type === 'STANDARD');
  const hasDaylight = timezone.subComponents.some(c => c.type === 'DAYLIGHT');
  if (!hasStandard && !hasDaylight) {
    errors.push({
      line: timezone.startLine,
      message: 'VTIMEZONE must contain at least one STANDARD or DAYLIGHT component',
      code: 'MISSING_TIMEZONE_DEFINITION',
      severity: 'error'
    });
  }
}

// Helper function to validate specific property values
export function validatePropertyValue(property: Property): ValidationError | null {
  switch (property.name) {
    case 'DTSTART':
    case 'DTEND':
    case 'DTSTAMP':
      return validateDateTime(property);
    case 'DURATION':
      return validateDuration(property);
    case 'RRULE':
      return validateRecurrenceRule(property);
    default:
      return null;
  }
}

function validateDateTime(property: Property): ValidationError | null {
  const value = property.value;
  const isDate = /^\d{8}$/.test(value);
  const isDateTime = /^\d{8}T\d{6}Z?$/.test(value);
  
  if (!isDate && !isDateTime) {
    return {
      line: property.line,
      message: `Invalid ${property.name} format: "${value}"`,
      code: 'INVALID_DATETIME',
      severity: 'error'
    };
  }
  
  return null;
}

function validateDuration(property: Property): ValidationError | null {
  const value = property.value;
  const durationRegex = /^[+-]?P(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/;
  
  if (!durationRegex.test(value)) {
    return {
      line: property.line,
      message: `Invalid DURATION format: "${value}"`,
      code: 'INVALID_DURATION',
      severity: 'error'
    };
  }
  
  return null;
}

function validateRecurrenceRule(property: Property): ValidationError | null {
  const value = property.value;
  const parts = value.split(';');
  const validFreqs = ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  
  let hasFreq = false;
  for (const part of parts) {
    const [key, val] = part.split('=');
    if (key === 'FREQ') {
      hasFreq = true;
      if (!validFreqs.includes(val)) {
        return {
          line: property.line,
          message: `Invalid FREQ value in RRULE: "${val}"`,
          code: 'INVALID_RRULE_FREQ',
          severity: 'error'
        };
      }
    }
  }
  
  if (!hasFreq) {
    return {
      line: property.line,
      message: 'RRULE must contain FREQ',
      code: 'MISSING_RRULE_FREQ',
      severity: 'error'
    };
  }
  
  return null;
}