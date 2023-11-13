
export const stUuids = {
    UUID_DEVINFO_SERV: '0000180a-0000-1000-8000-00805f9b34fb',
    UUID_DEVINFO_FWREV: '00002A26-0000-1000-8000-00805f9b34fb',

    UUID_IRT_SERV: 'f000aa00-0451-4000-b000-000000000000',
    UUID_IRT_DATA: 'f000aa01-0451-4000-b000-000000000000',
    UUID_IRT_CONF: 'f000aa02-0451-4000-b000-000000000000', // 0: disable, 1: enable
    UUID_IRT_PERI: 'f000aa03-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_ACC_SERV: 'f000aa10-0451-4000-b000-000000000000',
    UUID_ACC_DATA: 'f000aa11-0451-4000-b000-000000000000',
    UUID_ACC_CONF: 'f000aa12-0451-4000-b000-000000000000', // 0: disable, 1: enable
    UUID_ACC_PERI: 'f000aa13-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_HUM_SERV: 'f000aa20-0451-4000-b000-000000000000',
    UUID_HUM_DATA: 'f000aa21-0451-4000-b000-000000000000',
    UUID_HUM_CONF: 'f000aa22-0451-4000-b000-000000000000', // 0: disable, 1: enable
    UUID_HUM_PERI: 'f000aa23-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_MAG_SERV: 'f000aa30-0451-4000-b000-000000000000',
    UUID_MAG_DATA: 'f000aa31-0451-4000-b000-000000000000',
    UUID_MAG_CONF: 'f000aa32-0451-4000-b000-000000000000', // 0: disable, 1: enable
    UUID_MAG_PERI: 'f000aa33-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_OPT_SERV: 'f000aa70-0451-4000-b000-000000000000',
    UUID_OPT_DATA: 'f000aa71-0451-4000-b000-000000000000',
    UUID_OPT_CONF: 'f000aa72-0451-4000-b000-000000000000', // 0: disable, 1: enable
    UUID_OPT_PERI: 'f000aa73-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_BAR_SERV: 'f000aa40-0451-4000-b000-000000000000',
    UUID_BAR_DATA: 'f000aa41-0451-4000-b000-000000000000',
    UUID_BAR_CONF: 'f000aa42-0451-4000-b000-000000000000', // 0: disable, 1: enable
    UUID_BAR_CALI: 'f000aa43-0451-4000-b000-000000000000', // Calibration characteristic
    UUID_BAR_PERI: 'f000aa44-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_GYR_SERV: 'f000aa50-0451-4000-b000-000000000000',
    UUID_GYR_DATA: 'f000aa51-0451-4000-b000-000000000000',
    UUID_GYR_CONF: 'f000aa52-0451-4000-b000-000000000000', // 0: disable, bit 0: enable x, bit 1: enable y, bit 2: enable z
    UUID_GYR_PERI: 'f000aa53-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_MOV_SERV: 'f000aa80-0451-4000-b000-000000000000', // the service ID for the movement sensor
    UUID_MOV_DATA: 'f000aa81-0451-4000-b000-000000000000', // the characteristic ID for the movement sensor
    UUID_MOV_CONF: 'f000aa82-0451-4000-b000-000000000000', // 0: disable, bit 0: enable x, bit 1: enable y, bit 2: enable z
    UUID_MOV_PERI: 'f000aa83-0451-4000-b000-000000000000', // Period in tens of milliseconds

    UUID_MOV_NOTI: 'f0002902-0451-4000-b000-000000000000',

    UUID_TST_SERV: 'f000aa64-0451-4000-b000-000000000000',
    UUID_TST_DATA: 'f000aa65-0451-4000-b000-000000000000', // Test result

    UUID_KEY_SERV: '0000ffe0-0000-1000-8000-00805f9b34fb',
    UUID_KEY_DATA: '0000ffe1-0000-1000-8000-00805f9b34fb'
};

 export const accRanges = {     // Accelerometer ranges
    ACC_RANGE_2G:      0,
    ACC_RANGE_4G:      1,
    ACC_RANGE_8G:      2,
    ACC_RANGE_16G:     3
};

/*
37 	0x2800 	GATT Primary Service Declaration 	F000AA80-0451-4000-B000-000000000000 	R 	Movement Service
0x38 	0x2803 	GATT Characteristic Declaration 	12:39:00:00:00:00:00:00:00:00:B0:00:40:51:04:81:AA:00:F0 	R 	Movement Data
0x39 	0xAA81 	Movement Data 	  	RN 	GXLSB:GXMSB:GYLSB:GYMSB:GZLSB:GZMSB, AXLSB:AXMSB:AYLSB:AYMSB:AZLSB:AZMSB
0x3A 	0x2902 	Client Characteristic Configuration 	  	RW 	Write "01:00" to enable notifications, "00:00" to disable
0x3B 	0x2803 	GATT Characteristic Declaration 	0A:3C:00:00:00:00:00:00:00:00:B0:00:40:51:04:82:AA:00:F0 	R 	Movement Config
0x3C 	0xAA82 	Movement Config 	  	RW 	Axis enable bits:gyro-z=0,gyro-y,gyro-x,acc-z=3,acc-y,acc-x,mag=6 Range: bit 8,9
0x3D 	0x2803 	GATT Characteristic Declaration 	0A:3E:00:00:00:00:00:00:00:00:B0:00:40:51:04:83:AA:00:F0 	R 	Movement Period
0x3E 	0xAA83
*/
