// inventory.js (readable stub)
const InventoryModule = { id: 'inventory' };
if (typeof window !== 'undefined') {
	window.gameModules = window.gameModules || {};
	window.gameModules.inventory = InventoryModule;
}
export default InventoryModule;
