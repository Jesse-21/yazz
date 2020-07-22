
var fs = require("fs");

let dbFileName = process.argv[2]

console.log("importing MDB: " + dbFileName )

var offset = 0
var tempoffset


var stats = fs.statSync(dbFileName)
var fileSizeInBytes = stats["size"]


console.log("fileSizeInBytes: " + fileSizeInBytes )

var binary = fs.readFileSync(dbFileName);

//show("Buffer loaded?: " , Buffer.isBuffer( binary))

function longToByteArray(/*long*/long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};

function getInt64Bytes(x) {
  let y= Math.floor(x/2**32);
  return [y,(y<<8),(y<<16),(y<<24), x,(x<<8),(x<<16),(x<<24)].map(z=> z>>>24)
}

function intFromBytes(byteArr) {
    return byteArr.reduce((a,c,i)=> a+c*2**(56-i*8),0)
}

function byteArrayToLong(/*byte[]*/byteArray) {
    var value = 0;
    for ( var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }

    return value;
};

function show(title, value, typeshow ) {
    if (typeshow == "number") {
        console.log(title + ": " + byteArrayToLong(value))

    } else if (typeshow == "integer") {
        console.log(title + ": " + intFromBytes(value))

    } else if (typeshow == "hex") {
        console.log(title + ": 0x" + value.toString(16))

    } else {
        console.log(title + ": " + value)

    }
}

function find(offset, length , typeob) {
    let value = binary.slice(offset, offset + length)
    if (typeob=="number") {
        return byteArrayToLong(value)
    }
    return value
}



function getVar(params) {
    if (params.useJetVersion) {
        if (headerJetVersion != params.useJetVersion) {
            console.log("Skipping " + params.name)
            return null
        }
    }
    let retvalue = find(tempoffset , params.length, params.type)
    if (params.show) {
        show(params.name, retvalue, params.showas)

    }
    tempoffset = tempoffset + params.length
    return retvalue
}







console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("---------------                              " + dbFileName)
console.log("----------------------------------------------------------------------------------------------------------------")


console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                            HEADER                                              ----------")
console.log("------                                            offset: " + offset + "                               ")
console.log("----------------------------------------------------------------------------------------------------------------")

let headerMagicNumber = find(offset + 0, 4, "number")
show("magic number", headerMagicNumber, "hex")




let headerFileFormatID = find(offset + 4, 16)
show("file format ID", headerFileFormatID)


let headerJetFileVersion = find(offset + 0x14, 4, "number")
show("headerJetFileVersion", headerJetFileVersion)

let headerJetVersion = 4





console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                       HEADER  EXTRA                                            ----------")
console.log("----------------------------------------------------------------------------------------------------------------")

tempoffset = offset + 0x14 + 4
if (headerJetVersion == 3) {

    let SystemCollation = find(tempoffset + 0x22, 2)
    show("System Collation", SystemCollation, "number")

}






if (headerJetVersion == 3) {
    offset = offset + 2048
} else if (headerJetVersion == 4) {
    offset = offset + 4096
} else {
    //offset = offset + 2048
}
let PageSignature = find(offset + 0, 2, "number")
while (PageSignature != 0x102) {
    if (headerJetVersion == 3) {
        offset = offset + 2048
    } else if (headerJetVersion == 4) {
        offset = offset + 4096
    } else {
        //offset = offset + 2048
    }
    PageSignature = find(offset + 0, 2, "number")
}
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                    TABLE DEFNS PAGE HEADER                                     ----------")
console.log("------                                    offset: " + offset + "                               ")
console.log("----------------------------------------------------------------------------------------------------------------")
show("Page Signature", PageSignature, "hex")





tempoffset = offset + 8
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                    TABLE DEFNS DATA                                            ----------")
console.log("----------------------------------------------------------------------------------------------------------------")
let TableDefinitionLength = find(tempoffset, 4, "number")
show("Table Definition Length", TableDefinitionLength)

let Numberofrows = find(tempoffset + 8, 4, "number")
show("Number of rows", Numberofrows)

tempoffset = tempoffset + 12
let Autonumber = find(tempoffset, 4, "number")
show("Autonumber", Autonumber)



tempoffset = tempoffset + 4

let AutonumberIncrement = getVar({
    useJetVersion: 4,
    length: 4,
    name: "Autonumber Increment",
    type: "number"
})


getVar({
    useJetVersion: 4,
    length: 4,
    name: "Complex Autonumber",
    showas: "number"
})

getVar({
    useJetVersion: 4,
    length: 4,
    name: "Unknown"
})

getVar({
    useJetVersion: 4,
    length: 4,
    name: "Unknown"
})

getVar({
    length: 1,
    name: "Table Type / Flags?",
    type: "number"
})


getVar({
    length: 2,
    name: "Next Column Id",
    type: "number"
})


getVar({
    length: 2,
    name: "Variable columns",
    type: "number"
})


let colCount = getVar({
    length: 2,
    name: "Column Count",
    type: "number"
})


let indexCount = getVar({
    length: 4,
    name: "Index Count",
    type: "number"
})
let RealIndexCount = getVar({
    length: 4,
    name: "Real Index Count",
    type: "number"
})

getVar({
    length: 4,
    name: "Row Page Map",
    type: "number"
})

getVar({
    length: 4,
    name: "Free Space Page Map",
    type: "number"
})

//skip indexes
tempoffset = tempoffset + (12 * RealIndexCount)


for (var x=0; x< colCount; x++) {
    getVar({
        length: 1,
        name: "col Type",
        type: "number"
        ,
        show: false
    })
    getVar({
        useJetVersion: 4,
        length: 4,
        name: "Unknown"
        ,
        show: false
    })
    getVar({
        length: 2,
        name: "Col ID",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: 2,
        name: "Variable Column Number",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: 2,
        name: "Column Index",
        type: "number"
        ,
        show: false
    })
    getVar({
        useJetVersion: 4,
        length: 4,
        name: "Various"
        ,
        show: false
        //showas: "hex"
    })
    getVar({
        useJetVersion: 4,
        length: 2,
        name: "Col Flags"
        ,
        show: false
        //showas: "hex"
    })
    getVar({
        useJetVersion: 4,
        length: 4,
        name: "Unknown"
        ,
        show: false
    })
    getVar({
        length: 2,
        name: "Fixed offset",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: 2,
        name: "Length",
        type: "number"
        ,
        show: false
    })
}
for (var x=0; x< colCount; x++) {
    let colLen = getVar({
        length: 2,
        name: "col length",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: colLen,
        name: "col name"
        ,
        show: true
    })
}
for (var x=0; x< RealIndexCount; x++) {
    getVar({
        length: 4,
        name: "unknown",
        type: "number"
        ,
        show: true
    })
    getVar({
        length: 48,
        name: "unknown"
        ,
        show: false
    })
}
for (var x=0; x< indexCount; x++) {

    getVar({
        length: 28,
        name: "unknown"
        ,
        show: false
    })
}

for (var x=0; x< indexCount; x++) {
    let colLen = getVar({
        length: 2,
        name: "index length",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: colLen,
        name: "index name"
        ,
        show: true
    })
}



console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")



let col_num = getVar({
    length: 2,
    name: "col_num",
    type: "number"
    , show: true
})
let used_pages = getVar({
    length: 4,
    name: "used_pages",
    type: "number"
    , show: true
})
let free_pages = getVar({
    length: 4,
    name: "free_pages",
    type: "number"
    , show: true
})
 while (col_num != 0xffff  ) {
      col_num = getVar({
         length: 2,
         name: "col_num",
         type: "number"
         , show: true
     })
      used_pages = getVar({
         length: 4,
         name: "used_pages",
         type: "number"
         , show: true
     })
      free_pages = getVar({
         length: 4,
         name: "free_pages",
         type: "number"
         , show: true
     })
 }





console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
