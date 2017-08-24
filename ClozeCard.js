function ClozeCard(fullText, cloze){
	this.cloze = cloze;
	this.fullText = fullText;
	this.partialText = fullText.replace(cloze, '...');
}


module.exports = ClozeCard;
