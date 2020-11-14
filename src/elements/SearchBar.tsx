import { TextField, MenuItem, Grid } from '@material-ui/core'
import React from 'react'

const searchTypes = [
    {
        value: "Regex",
        tooltip: "A sentence with a given prefix or suffix"
    },
    {
        value: "Phone",
        tooltip: "A phone number with a give area code and/or consecutive number pattern"
    },
    {
        value: "Email",
        tooltip: "An email address on a domain that is only partially provided"
    },
    {
        value: "Three Words",
        tooltip: "Text that contains at least three of the following case sensitive words. [meeting, minutes, agenda, action, attendees, apologies]"
    },
    {
        value: "3 Letter word",
        tooltip: "A 3+ letter word thats all caps"
    },
]

export default function SearchBar() {
    const [searchType, setSearchType] = React.useState("regex")
    const [searchLock, setSearchLock] = React.useState(false);
    const [searchCount] = React.useState(0);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchType(event.target.value)
        
        if (event.target.value === "Regex" || event.target.value === "Phone" || event.target.value === "Email") {
          setSearchLock(false);
        }
        else {
          setSearchLock(true);
        }
      }
    return (
        <Grid>
            <TextField id="standard-basic" label="Search..." disabled={searchLock} />
            <TextField
                id="standard-select-searchType"
                select
                label="Select"
                value={searchType}
                onChange={handleSearchChange}
                helperText={`There are currently ${searchCount} results`}>
                {searchTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.value}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    )
}