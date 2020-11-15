import { TextField, MenuItem, Grid, makeStyles, createStyles, Theme, Paper, InputBase, IconButton, Divider, FormControl, Select, FormHelperText, Tooltip } from '@material-ui/core'
import { Close, Search } from '@material-ui/icons';
import React from 'react'
import { Note } from '../models/Note';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginTop: 40
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    hint: {
      marginLeft: 10
    }
  }),
);


const searchTypes = [
  {
    value: "Prefix",
    tooltip: "A sentence with a given prefix or suffix"
  },
  {
    value: "Suffix"
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

export interface SearchBarProps {
  setDisplayNotes: Function;
  notes: Array<Note>;
}

export default function SearchBar(props: SearchBarProps) {
  const { setDisplayNotes, notes } = props;
  const classes = useStyles();
  const [searchType, setSearchType] = React.useState("Pefix")
  const [searchLock, setSearchLock] = React.useState(false);
  const [searchCount, setSearchCount] = React.useState(0);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const handleSearchChange = (event: any) => {
    setSearchType(event.target.value)

    if (
      event.target.value === "Prefix"
      || event.target.value === "Suffix"
      || event.target.value === "Phone"
    ) {
      setSearchLock(false);
    }
    else {
      setSearchLock(true);
    }
  }

  const handleTextChange = (e: any) => {
    setSearchText(e.target.value);
  }

  const handleSearch = (e: any) => {
    e.preventDefault();
    let n: Array<{ id: number, content: string }> = [];

    notes.forEach((note: Note) => {
      n.push({ id: note.id, content: stripStyling(note.content) })
    });

    let results = searchByType(n, searchType, searchText);

    setSearchCount(results.length);
    showResults(results);
    setHasSearched(true);
  }

  const rThreeLetter = /([A-Z]{3,})/g;
  const rThreeWorlds = /(meeting|minutes|agenda|action|attendees|apologies)/g;
  const rEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-zA-Z0-9]){3,}(\.)*([a-zA-Z0-9])*/g;
  const rAreaCode = /^([0-9]){2}$/g;
  const rNumber = /^([0-9]){1,}$/g;


  const searchByType = (notes: Array<{ id: number, content: string }>, type: string, search?: string): Array<{ id: number, content: string }> => {
    let output: Array<{ id: number, content: string }> = [];

    notes.forEach((note: { id: number, content: string }) => {

      if (type === "Prefix") {
        note.content.split(".").forEach(s => {
          if(search && s.startsWith(search)) {
            output.push(note);
          }
        });
      } else if (type === "Suffix") {
        note.content.split(".").forEach(s => {
          if(search && s.endsWith(search)) {
            output.push(note);
          }
        });
      } else if (type === "Phone") {
        let matchedArea = false;
        searchText.split(" ").forEach(s => {
          if(countMatches(s, rAreaCode) === 1 && !matchedArea) {
            matchedArea = true;
            output.push(note);
          } else if (countMatches(s, rNumber) === 1) {
            if(!output.includes(note)) {
              output.push(note);
            }
          }
        })
      } else if (type === "Email") {
        if (countMatches(note.content, rEmail) > 0) {
          output.push(note);
        }
      } else if (type === "Three Words") {
        if (countMatches(note.content, rThreeWorlds) >= 3) {
          output.push(note);
        }
      } else if (type === "3 Letter word") {
        if (countMatches(note.content, rThreeLetter) > 0) {
          output.push(note);
        }
      }

    });

    return output;
  }

  const countMatches = (str: string, re: RegExp): number => {
    return ((str || '').match(re) || []).length
  }

  const showResults = (n: Array<{ id: number, content: string }>) => {
    let noteList: Array<Note> = [];

    notes.forEach((note) => {
      n.forEach((note2) => {
        if (note2.id === note.id) {
          noteList.push(note);
        }
      })
    });

    setDisplayNotes(noteList);
  }


  const handleReset = (e: any) => {
    e.preventDefault();
    setSearchCount(0);
    setHasSearched(false);
    setDisplayNotes(notes);
  }

  const stripStyling = (state: string): string => {
    let editorState = EditorState.createWithContent(
      convertFromRaw(
        JSON.parse(
          atob(state)
        )
      )
    );
    return editorState.getCurrentContent().getPlainText("");
  }

  return (
    <>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          id="search-field"
          onChange={handleTextChange}
          disabled={searchLock} />
        {hasSearched &&
          (
            <IconButton className={classes.iconButton} type="reset" aria-label="reset" onClick={(e) => handleReset(e)}>
              <Close />
            </IconButton>
          )}
        {!hasSearched &&
          (
            <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={(e) => handleSearch(e)}>
              <Search />
            </IconButton>
          )}
        <Divider className={classes.divider} orientation="vertical" />
        <FormControl className={classes.formControl}>
          <Select
            value={searchType}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search type' }}
          >
            {searchTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      <FormHelperText className={classes.hint}>
        {
          hasSearched && (
            `${searchCount} results match your search.`
          )
        }
      </FormHelperText>
    </>
  )
}