const { getDriver, getVehicle, getTrips } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */


async function driverReport() {
  try {
    const trips = await getTrips();
    const drivers = {}; // Object to store driver data

    // Process each trip and organize data by driver
    for (const trip of trips) {
      const driverID = trip.driverID;
      if (!drivers[driverID]) {
        // Initialize driver data
        const driverInfo = await getDriver(driverID);
        drivers[driverID] = {
          fullName: driverInfo.name,
          id: driverID,
          phone: driverInfo.phone,
          noOfTrips: 0,
          noOfVehicles: 0,
          vehicles: [],
          noOfCashTrips: 0,
          noOfNonCashTrips: 0,
          totalAmountEarned: 0,
          totalCashAmount: 0,
          totalNonCashAmount: 0,
          trips: [],
        };
      }

      // Update driver data based on the trip
      drivers[driverID].noOfTrips++;
      drivers[driverID].totalAmountEarned += trip.billedAmount;

      if (trip.isCash) {
        drivers[driverID].noOfCashTrips++;
        drivers[driverID].totalCashAmount += trip.billedAmount;
      } else {
        drivers[driverID].noOfNonCashTrips++;
        drivers[driverID].totalNonCashAmount += trip.billedAmount;
      }

      // Add the trip details to the driver's trips array
      drivers[driverID].trips.push({
        user: trip.userName,
        created: trip.created,
        pickup: trip.pickupAddress,
        destination: trip.destinationAddress,
        billed: trip.billedAmount,
        isCash: trip.isCash,
      });
    }

    // Get vehicle information for each driver
    for (const driverID in drivers) {
      const driver = drivers[driverID];
      const driverInfo = await getDriver(driverID);
      driver.noOfVehicles = driverInfo.vehicleID.length;

      for (const vehicleID of driverInfo.vehicleID) {
        const vehicleInfo = await getVehicle(vehicleID);
        driver.vehicles.push({
          plate: vehicleInfo.plate,
          manufacturer: vehicleInfo.manufacturer,
        });
      }
    }

    // Convert the drivers object into an array
    const driverArray = Object.values(drivers);

    //return driverArray;
    console.log(driverArray)

  } catch (error) {
    throw error;
  }
}

module.exports = driverReport;