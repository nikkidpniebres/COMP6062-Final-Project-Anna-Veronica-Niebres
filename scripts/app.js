const app = Vue.createApp({
    // Data properties for the Vue instance
    data() {
        return {
            trivia: '',                    
            city: 'London, Ontario',       
            cityWeather: '',               
            cityTemp: '',                  
            cityWind: '',                  
            description: '',               
            word: '',                      
            definition: {},               
            loading: false,                
        };
    },
    computed:
    {
        randomTrivia() 
        {
            if (this.loading) 
            {
                return 'Loading...';       
            } else 
            {
                return this.trivia;        
            }
        }
    },
    methods: 
    {
        // Method to fetch a Trivia
        clickTrivia() 
        {
            fetch('https://uselessfacts.jsph.pl/api/v2/facts/random')
                .then(response => response.json())
                .then(data => 
                {
                    this.trivia = data.text; 
                })
                .catch(error => 
                {
                    console.error('Error: ', error); 
                    this.trivia = 'Failed to load fact.'; 
                });
        },

        // Method to fetch weather data
        clickWeather() 
        {
            this.loading = true; // Set loading to true while data is being fetched

            fetch(`https://goweather.herokuapp.com/weather/${this.city}`)
                .then(response => response.json())
                .then(data => {
                    if (data.temperature)
                    {
                        
                        this.cityWeather = this.city;
                        this.cityTemp = data.temperature;
                        this.cityWind = data.wind;
                        this.description = data.description;
                    } 
                    else 
                    {
                        
                        this.cityWeather = 'No weather data available.';
                        this.cityTemp = '';
                        this.cityWind = '';
                        this.description = '';
                    }
                    this.loading = false; 
                })
                .catch(error => 
                {
                    console.error('Error:', error);
                    this.cityWeather = 'Failed to load weather data.'; 
                    this.cityTemp = '';
                    this.cityWind = '';
                    this.description = '';
                    this.loading = false;
                });
        },
        
       // Method to fetch the definition of a specified word

        defineWord() 
        {
            this.loading = true; 
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`)

                .then(response => response.json()) 
                .then(data =>{
                    const entry = data[0]; 
                    const meaning = entry.meanings[0]; 

                    this.definition =
                    {
                        word: entry.word,                     
                        phonetic: entry.phonetic,             
                        partOfSpeech: meaning.partOfSpeech,   
                        meaning: meaning.definitions[0].definition 
                    };
                    
                    this.loading = false;

                })
                
                .catch(error =>
                {
                    console.error('Error:', error);
                    this.loading = false;
                });
        },
    },


    created()
    {
        this.clickTrivia();     
        this.clickWeather();    
        this. defineWord();     
    }
});

// Mount the Vue instance to the HTML element with id 'app'
app.mount('#app');
