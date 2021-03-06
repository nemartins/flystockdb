/* ************************************************************************

   Copyright and License: see LICENSE file

   Contributors:
     * Joachim Baran

************************************************************************ */

/**
 * A class for assembling views of genotypes.
 */
qx.Class.define("gazebo.fly.GenotypeWriter",
{
  extend : qx.core.Object,

  construct: function()
  {
    this.base(arguments);
  },

  members:
  {
    // rich toggles the generation of the machine readable format. 'true'
    // means that machine output is generated.
    flattenChromosome : function(chromosome, rich, context)
    {
      var flat = ""

      for (var i = 0; i < chromosome.length; i++) {
        if (chromosome[i].plainModel) {
          if (rich) {
            var suggestion = context;
            flat += '@';
            if (chromosome[i].flybaseModel) {
              flat += chromosome[i].flybaseModel;
              suggestion = chromosome[i].chromosomeSuggestionModel;
            }
            flat += ':' + chromosome[i].plainModel + '$' + suggestion + '$' + context + '@';
          } else {
            flat += chromosome[i].plainModel;
          }

          // The space is important for the decompositioning algorithm
          // in Contribution.js.
          if (chromosome[i].commaSwitchedOn) {
            flat += ', ';
          } else {
            flat += ' ';
          }
        }
      }

      if (flat.length == 0) {
        flat = '+';
      }

      return flat.replace(/^\s+|\s+$/g, '');
    },

    // TODO Something that can be used to uniquely reconstruct the genotype.
    stringNotation : function(chromosomes)
    {
      var string = "";
      var chromosomeContents = "";

      for (var i = 0; i < chromosomes.length; i++) {
        var context = '' + i % 6;

        if (chromosomes[i].length == 1) {
          // Y or U
          string += this.flattenChromosome(chromosomes[i][0], true, context);
        } else if (chromosomes[i].length == 2) {
          // X, 2, 3 or 4
          var parent1 = chromosomes[i][0];
          var parent2 = chromosomes[i][1];

          string += this.flattenChromosome(parent1, true, context) + '/' +
            this.flattenChromosome(parent2, true, context);
        }

        if (i + 1 < chromosomes.length) {
          string += ';';
        }
      }

      return string;      
    },

    flybaseNotation : function(chromosomes)
    {
      var flybaseString = "";
      var chromosomeContents = "";

      for (var i = 0; i < chromosomes.length; i++) {
        if (!chromosomes[i]) {
          continue;
        }

        if (chromosomes[i].length == 1) {
          // Y or U
          chromosomeContents = this.flattenChromosome(chromosomes[i][0]);
        } else if (chromosomes[i].length == 2) {
          // X, 2, 3 or 4
          var parent1 = chromosomes[i][0];
          var parent2 = chromosomes[i][1];
          var parent2Values = new Array();

          for (var j = 0; j < parent2.length; j++) {
            if (parent2[j].plainModel) {
              parent2Values.push(parent2[j].plainModel);
            }
          }

          var everythingHomozygous = true;

          if (parent1.length != parent2.length) {
            everythingHomozygous = false;
          } else {
            for (j = 0; j < parent1.length; j++) {
              if (!parent1[j].plainModel || parent2Values.indexOf(parent1[j].plainModel) == -1) {
                everythingHomozygous = false;
                break;
              }
            }
          }

          if (everythingHomozygous) {
            chromosomeContents = this.flattenChromosome(parent1);
          } else {
            chromosomeContents = this.flattenChromosome(parent1) + ' / ' + this.flattenChromosome(parent2);
          }
        } else {
          // Woops...
        }

        // Remove wild-type chromosomes:
        if (chromosomeContents == '+' || chromosomeContents == '+ / +') {
          chromosomeContents = '';
        }

        flybaseString += chromosomeContents;

        if (i < chromosomes.length - 1 && chromosomeContents.length > 0) {
          flybaseString += ' ; ';
        }
      }

      if (flybaseString.length == 0) {
        flybaseString = '+';
      }

      flybaseString = flybaseString.replace(/\s;\s$/, '');

      return flybaseString;
    }
  }
});