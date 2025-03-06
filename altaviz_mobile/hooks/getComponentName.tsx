export function getComponentName() {
    const stack = new Error().stack;
    const match = stack!.match(/at (\w+)/g);
    return console.log('$$$$$ COMPONENT NAME #####:', match ? match[1].replace("at ", "") : "Unknown");
}

// export function useMyComponent() {
// 	console.log('in MyComponent')
// 	const componentName = getComponentName();
//     console.log('component Name:'.toUpperCase(), componentName); // Logs "MyComponent"
//     return componentName
// }
