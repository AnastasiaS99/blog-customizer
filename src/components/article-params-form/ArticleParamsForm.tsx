import React, { useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	fontColors,
	fontFamilyOptions,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import styles from './ArticleParamsForm.module.scss';

export type ArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	setCurrentArticleState: (data: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentArticleState,
	setCurrentArticleState,
}: ArticleParamsFormProps) => {
	// Видимость боковой панели
	const [isOpen, selectedIsOpen] = useState<boolean>(false);

	// Локальное состояние формы
	const [formState, selectedFormState] =
		useState<ArticleStateType>(currentArticleState);

	// ref для клика вне формы
	const rootRef = useRef<HTMLDivElement>(null);

	// Обработка клика вне формы
	useOutsideClickClose({
		isOpen,
		rootRef,
		onClose: () => selectedIsOpen(false),
		onChange: (open) => selectedIsOpen(open),
	});

	// Отправка формы
	const submitForm = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentArticleState(formState);
		selectedIsOpen(false);
	};

	// Сброс формы
	const resetForm = (e: React.FormEvent) => {
		e.preventDefault();
		selectedFormState(defaultArticleState);
		setCurrentArticleState(defaultArticleState);
	};

	// Обновление поля формы
	const changeForm = (
		field: keyof ArticleStateType,
		value: ArticleStateType[keyof ArticleStateType]
	) => {
		selectedFormState((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => selectedIsOpen(!isOpen)} />
			<aside
				ref={rootRef}
				className={`${styles.container} ${
					isOpen ? styles.container_open : ''
				}`}>
				<form className={styles.form} onSubmit={submitForm} onReset={resetForm}>
					<Text size={31} uppercase weight={800}>
						Задайте параметры
					</Text>

					{/* Выбор шрифта */}
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(opt) => changeForm('fontFamilyOption', opt)}
					/>

					{/* Размер шрифта */}
					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(opt) => changeForm('fontSizeOption', opt)}
					/>

					{/* Цвет шрифта */}
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={(opt) => changeForm('fontColor', opt)}
					/>

					<Separator />

					{/* Цвет фона */}
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(opt) => changeForm('backgroundColor', opt)}
					/>

					{/* Ширина контента */}
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(opt) => changeForm('contentWidth', opt)}
					/>

					{/* Кнопки */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
