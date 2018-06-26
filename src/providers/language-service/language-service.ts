import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language } from './../../models/language';
import { Character } from './../../models/character';
import { Level } from './../../models/level';
import { Image } from './../../models/image';

import { Globals } from './../../app/globals';


@Injectable()
export class LanguageServiceProvider {

	constructor(
		public http: HttpClient,	
		private globals: Globals
	) {
		console.log('Hello LanguageServiceProvider Provider');
	}

	getAll () {
		return new Promise((resolve, reject) => {
			this.http.get(this.globals.apiUrl('get-languages')).subscribe(data => {
				let result: Language[] = data['languages'].map((item) => {
					return {
						id: item['id'],
						language_name : item['language_name']
					} 
				});	
				resolve(result);
			}, err => {
			  	reject(err);
			});
		});
    }
    
    getCharacters (languageId: number) {
        return new Promise((resolve, reject) => {
			this.http.get(this.globals.apiUrl(`language/${languageId}/get-characters`)).subscribe(data => {
				let result: Character[] = data['characters'].map((item) => {
					return  {
                        id: item['id'],
                        language_id: item['language_id'],
                        english_term : item['english_term'],
                        filepath: item['image_filepath'],
					}
				});	
				resolve(result);
			}, err => {
			  	reject(err);
			});
		});
    }

    getLevel(languageId: number, difficulty: number = 1) {
        return new Promise((resolve, reject) => {
            this.http.get(this.globals.apiUrl(`language/${languageId}/get-random-level?difficulty=${difficulty}`))
                .subscribe(data => {
                    let answer: Character[] = data['level']['answer_levels'].map((item) => {
                        let char: Character = {
                            id: item['id'],
                            language_id: item['language_id'],
                            english_term: item['english_term'],
                            filepath: item['image_filepath'],
                            chosen: false
                        };
                        return char;
                    });
                    let image: Image = {
                        id: data['level']['picture']['id'],
                        language_id: data['level']['picture']['language_id'],
                        english_term: data['level']['picture']['english_term'],
                        language_origin_term: data['level']['picture']['language_origin_term'],
                        filepath: data['level']['picture']['image_filepath']
                    };
                    let level: Level = {
                        id: data['level']['id'],
                        difficulty: data['level']['difficulty'],
                        answer: answer,
                        image: image
                    };
                
                    resolve(level)
                }, err => {
                    reject(err);
                });
		});
    }

    getAllLevels(languageId: number) {
        return new Promise((resolve, reject) => {
            this.http.get(this.globals.apiUrl(`language/${languageId}/get-all-level`))
                .subscribe(result => {
                    let levels: Level[] = result['level'].map(data => {
                        let answer: Character[] = data['answer_levels'].map((item) => {
                            let char: Character = {
                                id: item['id'],
                                language_id: item['language_id'],
                                english_term: item['english_term'],
                                filepath: item['image_filepath'],
                                chosen: false
                            };
                            return char;
                        });
                        let image: Image = {
                            id: data['picture']['id'],
                            language_id: data['picture']['language_id'],
                            english_term: data['picture']['english_term'],
                            language_origin_term: data['picture']['language_origin_term'],
                            filepath: data['picture']['image_filepath']
                        };
                        let level: Level = {
                            id: data['id'],
                            difficulty: data['difficulty'],
                            answer: answer,
                            image: image
                        };
                        return level;
                    });
                
                    resolve(levels)
                }, err => {
                    reject(err);
                });
		});
    }

}
